using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StraviaTec_Web.Helpers;
using StraviaTec_Web.Models;
using StraviaTec_Web.Models.Dtos;
using StraviaTec_Web.Models.Requests;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetoController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;


        public RetoController(AppDbContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }


        [HttpPost]
        public async Task<ActionResult<Reto>> PostReto(RetoInfo data)
        {
            using var dbTransaction = await _context.Database.BeginTransactionAsync();
             try
            {
            //Crea entidad tipoReto
            var tipoReto =  new TipoReto{
                Nombre = data.Nombre,
            };
            await _context.TipoReto.AddAsync(tipoReto);
            await _context.SaveChangesAsync();
            Console.WriteLine(tipoReto.Id);
            Console.WriteLine(tipoReto.Nombre);
            //Crea entidad Evento
            var idTipoEvento = (await _context.TipoEvento.FirstOrDefaultAsync(e => e.Nombre == "Reto")).Id;
            var evento = new Evento{
                IdTipoEvento = idTipoEvento,
                IdTipoActividad = data.IdActividad,
                Nombre = data.Nombre,
                EsPrivado = data.EsPrivado
            };
            Console.WriteLine(evento.IdTipoActividad);
            await _context.Evento.AddAsync(evento);
            await _context.SaveChangesAsync();

            //Crea entidad Reto
            var reto = new Reto{
                IdEvento = evento.Id,
                IdTipoReto = tipoReto.Id,
                Inicio = data.Inicio,
                Fin = data.Fin,
                Objetivo = data.Objetivo,
            };
            await _context.Reto.AddAsync(reto);
            await _context.SaveChangesAsync();

            //Entidades patrocinador y grupos si es privado
           foreach (var patrocinador in data.Patrocinadores) 
                {
                    var patrocinadorEvento = new PatrocinadorEvento
                    {
                        IdEvento = evento.Id,
                        IdPatrocinador = patrocinador
                    };
                    await _context.PatrocinadorEvento.AddAsync(patrocinadorEvento);
                    await _context.SaveChangesAsync();
                }

                 if (data.EsPrivado) 
                {
                    foreach (var grupo in data.Grupos)
                    {
                        var grupoEvento = new EventoGrupo
                        {
                            IdEvento = evento.Id,
                            IdGrupo = grupo
                        };
                        await _context.EventoGrupo.AddAsync(grupoEvento);
                        await _context.SaveChangesAsync();
                    }
                }
                await dbTransaction.CommitAsync();
                 var retoDto = _mapper.Map<RetoDto>(reto);
                return CreatedAtAction("GetReto", new { id = reto.Id }, retoDto);
                } catch (DbUpdateException ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        // DELETE: api/Reto
        [HttpDelete("{id}")]
        public async Task<ActionResult<Carrera>> DeleteReto(int id)
        {
            var reto = await _context.Reto.FindAsync(id);
            if (reto == null)
            {
                return NotFound();
            }

            var evento = await _context.Evento.FindAsync(reto.IdEvento);

            _context.Evento.Remove(evento);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool RetoExists(int id)
        {
            return _context.Reto.Any(e => e.Id == id);
        }
    }
}
