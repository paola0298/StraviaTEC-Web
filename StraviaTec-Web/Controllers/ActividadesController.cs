using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Helpers;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Dtos;
using StraviaTec_Web.Models.Requests;

namespace StraviaTec_Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActividadesController: ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ActividadesController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivityAsync(InfoActividad activity)
        {
            if (activity == null)
                return BadRequest();

            using var transaction = await _context.Database.BeginTransactionAsync();


            var evento = await _context.Evento.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_tipo_evento"", ""Nombre"", ""Es_privado"", ""Id_tipo_actividad""
                FROM ""EVENTO""
                WHERE ""Id"" = {activity.IdEvento}
            ").FirstOrDefaultAsync();

            if (evento == null && activity.EsEvento)
                return BadRequest();

            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                INSERT INTO ""RECORRIDO"" (""Nombre"", ""Fecha_hora"") VALUES
                ({activity.Nombre}, {activity.Fecha})
            ");
            await _context.SaveChangesAsync();

            var recorrido = await _context.Recorrido.FromSqlInterpolated($@"
                SELECT ""Id"", ""Nombre"", ""Fecha_hora"" FROM ""RECORRIDO""
                WHERE ""Id"" = (SELECT MAX(""Id"") FROM ""RECORRIDO"")
            ").FirstOrDefaultAsync();

            var puntos = GpxParser.Parse(activity.Recorrido, recorrido.Id);

            foreach (var punto in puntos)
            {
                await _context.Database.ExecuteSqlInterpolatedAsync($@"
                    INSERT INTO ""PUNTO"" (""Id_recorrido"", ""Segmento"", ""Orden"", ""Latitud"", ""Longitud"", ""Tiempo"", ""Elevacion"") VALUES
                    ({punto.IdRecorrido}, {punto.Segmento}, {punto.Orden}, {punto.Latitud}, {punto.Longitud}, {punto.Tiempo}, {punto.Elevacion})
                ");
                await _context.SaveChangesAsync();
            }

            await _context.Database.ExecuteSqlInterpolatedAsync($@"
                INSERT INTO ""ACTIVIDAD"" (""Id_usuario"", ""Id_tipo_actividad"", ""Id_recorrido"", ""Fecha"", ""Duracion"", ""Kilometros"", ""Es_evento"", ""Id_evento"") VALUES
                ({activity.User}, {activity.IdTipoActividad}, {recorrido.Id}, {activity.Fecha}, {activity.Duracion}, {activity.Kilometros}, {activity.EsEvento}, {activity.IdEvento})
            ");
            await _context.SaveChangesAsync();

            if (activity.TipoEvento == "reto")
            {
                var reto = await _context.Reto.FromSqlInterpolated($@"
                    SELECT ""Id"", ""Id_evento"", ""Id_tipo_reto"", ""Inicio"", ""Fin"", ""Objetivo""
                    FROM ""RETO""
                    WHERE ""Id_evento"" = {evento.Id}
                ").FirstOrDefaultAsync();

                if (reto != null)
                {
                    var objetivo = reto.Objetivo;
                    var actividadesDeReto = await _context.Actividad.FromSqlInterpolated($@"
                        SELECT ""Id"", ""Id_usuario"", ""Id_tipo_actividad"", ""Id_recorrido"", ""Fecha"", ""Duracion"", Kilometros"", ""Es_evento"", ""Id_evento""
                        FROM ""ACTIVIDAD""
                        WHERE ""Es_evento"" = {true} AND ""Id_evento"" = {evento.Id}
                    ").ToListAsync();

                    decimal progress = 0;
                    foreach (var atc in actividadesDeReto)
                    {
                        progress += atc.Kilometros;
                    }

                    var result = (progress >= objetivo) ? 100 : progress;

                    await _context.Database.ExecuteSqlInterpolatedAsync($@"
                        UPDATE ""INSCRIPCION_EVENTO""
                        SET ""Progreso"" = {progress}
                        WHERE ""Id_usuario"" = {activity.User} AND ""Id_evento"" = {evento.Id}
                    ");
                }
            }

            await transaction.CommitAsync();

            var actividad = await _context.Actividad.FromSqlInterpolated($@"
                SELECT ""Id"", ""Id_usuario"", ""Id_tipo_actividad"", ""Id_recorrido"", ""Fecha"", ""Duracion"", ""Kilometros"", ""Es_evento"", ""Id_evento"" 
                FROM ""ACTIVIDAD""
                WHERE ""Id"" = (SELECT MAX(""Id"") FROM ""ACTIVIDAD"")
                ")
                .Include(a => a.IdEventoNavigation)
                .FirstOrDefaultAsync();
            
            return Ok(_mapper.Map<ActividadDto>(actividad));
        }
    }
}