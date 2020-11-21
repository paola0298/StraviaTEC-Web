using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace StraviaTec_Web.Models
{
    public partial class AppDbContext : DbContext
    {
        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Actividad> Actividad { get; set; }
        public virtual DbSet<Carrera> Carrera { get; set; }
        public virtual DbSet<Categoria> Categoria { get; set; }
        public virtual DbSet<CategoriaCarrera> CategoriaCarrera { get; set; }
        public virtual DbSet<CuentaBancaria> CuentaBancaria { get; set; }
        public virtual DbSet<Evento> Evento { get; set; }
        public virtual DbSet<EventoGrupo> EventoGrupo { get; set; }
        public virtual DbSet<Grupo> Grupo { get; set; }
        public virtual DbSet<InscripcionEvento> InscripcionEvento { get; set; }
        public virtual DbSet<Patrocinador> Patrocinador { get; set; }
        public virtual DbSet<PatrocinadorEvento> PatrocinadorEvento { get; set; }
        public virtual DbSet<Punto> Punto { get; set; }
        public virtual DbSet<Recorrido> Recorrido { get; set; }
        public virtual DbSet<Reto> Reto { get; set; }
        public virtual DbSet<TipoActividad> TipoActividad { get; set; }
        public virtual DbSet<TipoEvento> TipoEvento { get; set; }
        public virtual DbSet<TipoReto> TipoReto { get; set; }
        public virtual DbSet<Usuario> Usuario { get; set; }
        public virtual DbSet<UsuarioAmigo> UsuarioAmigo { get; set; }
        public virtual DbSet<UsuarioGrupo> UsuarioGrupo { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=StraviaTEC;Username=StraviaUser;Password=StraviaTEC_2020;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Actividad>(entity =>
            {
                entity.ToTable("ACTIVIDAD");

                entity.Property(e => e.Duracion).HasColumnType("numeric(5,1)");

                entity.Property(e => e.EsEvento).HasColumnName("Es_evento");

                entity.Property(e => e.IdEvento).HasColumnName("Id_evento");

                entity.Property(e => e.IdRecorrido).HasColumnName("Id_recorrido");

                entity.Property(e => e.IdTipoActividad).HasColumnName("Id_tipo_actividad");

                entity.Property(e => e.IdUsuario)
                    .IsRequired()
                    .HasColumnName("Id_usuario")
                    .HasMaxLength(50);

                entity.Property(e => e.Kilometros).HasColumnType("numeric(5,1)");

                entity.HasOne(d => d.IdEventoNavigation)
                    .WithMany(p => p.Actividad)
                    .HasForeignKey(d => d.IdEvento)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("ACTIVIDAD_Id_evento_fkey");

                entity.HasOne(d => d.IdRecorridoNavigation)
                    .WithMany(p => p.Actividad)
                    .HasForeignKey(d => d.IdRecorrido)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("ACTIVIDAD_Id_recorrido_fkey");

                entity.HasOne(d => d.IdTipoActividadNavigation)
                    .WithMany(p => p.Actividad)
                    .HasForeignKey(d => d.IdTipoActividad)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("ACTIVIDAD_Id_tipo_actividad_fkey");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.Actividad)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("ACTIVIDAD_Id_usuario_fkey");
            });

            modelBuilder.Entity<Carrera>(entity =>
            {
                entity.ToTable("CARRERA");

                entity.Property(e => e.Costo).HasColumnType("numeric(7,2)");

                entity.Property(e => e.IdEvento).HasColumnName("Id_evento");

                entity.Property(e => e.IdRecorrido).HasColumnName("Id_recorrido");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.IdEventoNavigation)
                    .WithMany(p => p.Carrera)
                    .HasForeignKey(d => d.IdEvento)
                    .HasConstraintName("CARRERA_Id_evento_fkey");

                entity.HasOne(d => d.IdRecorridoNavigation)
                    .WithMany(p => p.Carrera)
                    .HasForeignKey(d => d.IdRecorrido)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("CARRERA_Id_recorrido_fkey");
            });

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.ToTable("CATEGORIA");

                entity.Property(e => e.Descripcion).IsRequired();

                entity.Property(e => e.EdadMax).HasColumnName("Edad_max");

                entity.Property(e => e.EdadMin).HasColumnName("Edad_min");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<CategoriaCarrera>(entity =>
            {
                entity.ToTable("CATEGORIA_CARRERA");

                entity.Property(e => e.IdCarrera).HasColumnName("Id_carrera");

                entity.Property(e => e.IdCategoria).HasColumnName("Id_categoria");

                entity.HasOne(d => d.IdCarreraNavigation)
                    .WithMany(p => p.CategoriaCarrera)
                    .HasForeignKey(d => d.IdCarrera)
                    .HasConstraintName("CATEGORIA_CARRERA_Id_carrera_fkey");

                entity.HasOne(d => d.IdCategoriaNavigation)
                    .WithMany(p => p.CategoriaCarrera)
                    .HasForeignKey(d => d.IdCategoria)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("CATEGORIA_CARRERA_Id_categoria_fkey");
            });

            modelBuilder.Entity<CuentaBancaria>(entity =>
            {
                entity.ToTable("CUENTA_BANCARIA");

                entity.Property(e => e.IdCarrera).HasColumnName("Id_carrera");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.IdCarreraNavigation)
                    .WithMany(p => p.CuentaBancaria)
                    .HasForeignKey(d => d.IdCarrera)
                    .HasConstraintName("CUENTA_BANCARIA_Id_carrera_fkey");
            });

            modelBuilder.Entity<Evento>(entity =>
            {
                entity.ToTable("EVENTO");

                entity.Property(e => e.EsPrivado).HasColumnName("Es_privado");

                entity.Property(e => e.IdTipoActividad).HasColumnName("Id_tipo_actividad");

                entity.Property(e => e.IdTipoEvento).HasColumnName("Id_tipo_evento");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.IdTipoActividadNavigation)
                    .WithMany(p => p.Evento)
                    .HasForeignKey(d => d.IdTipoActividad)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("EVENTO_Id_tipo_actividad_fkey");

                entity.HasOne(d => d.IdTipoEventoNavigation)
                    .WithMany(p => p.Evento)
                    .HasForeignKey(d => d.IdTipoEvento)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("EVENTO_Id_tipo_evento_fkey");
            });

            modelBuilder.Entity<EventoGrupo>(entity =>
            {
                entity.ToTable("EVENTO_GRUPO");

                entity.Property(e => e.IdEvento).HasColumnName("Id_evento");

                entity.Property(e => e.IdGrupo).HasColumnName("Id_grupo");

                entity.HasOne(d => d.IdEventoNavigation)
                    .WithMany(p => p.EventoGrupo)
                    .HasForeignKey(d => d.IdEvento)
                    .HasConstraintName("EVENTO_GRUPO_Id_evento_fkey");

                entity.HasOne(d => d.IdGrupoNavigation)
                    .WithMany(p => p.EventoGrupo)
                    .HasForeignKey(d => d.IdGrupo)
                    .HasConstraintName("EVENTO_GRUPO_Id_grupo_fkey");
            });

            modelBuilder.Entity<Grupo>(entity =>
            {
                entity.ToTable("GRUPO");

                entity.Property(e => e.IdAdmin)
                    .IsRequired()
                    .HasColumnName("Id_admin")
                    .HasMaxLength(30);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasOne(d => d.IdAdminNavigation)
                    .WithMany(p => p.Grupo)
                    .HasForeignKey(d => d.IdAdmin)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("GRUPO_Id_admin_fkey");
            });

            modelBuilder.Entity<InscripcionEvento>(entity =>
            {
                entity.ToTable("INSCRIPCION_EVENTO");

                entity.Property(e => e.ComprobantePago)
                    .HasColumnName("Comprobante_pago")
                    .HasMaxLength(200);

                entity.Property(e => e.Estado)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.IdEvento).HasColumnName("Id_evento");

                entity.Property(e => e.IdUsuario)
                    .IsRequired()
                    .HasColumnName("Id_usuario")
                    .HasMaxLength(30);

                entity.Property(e => e.Progreso).HasColumnType("numeric(5,0)");

                entity.HasOne(d => d.IdCategoriaCarreraNavigation)
                    .WithMany(p => p.InscripcionEvento)
                    .HasForeignKey(d => d.IdCategoriaCarrera)
                    .HasConstraintName("INSCRIPCION_EVENTO_IdCategoriaCarrera_fkey");

                entity.HasOne(d => d.IdEventoNavigation)
                    .WithMany(p => p.InscripcionEvento)
                    .HasForeignKey(d => d.IdEvento)
                    .HasConstraintName("INSCRIPCION_EVENTO_Id_evento_fkey");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.InscripcionEvento)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("INSCRIPCION_EVENTO_Id_usuario_fkey");
            });

            modelBuilder.Entity<Patrocinador>(entity =>
            {
                entity.ToTable("PATROCINADOR");

                entity.Property(e => e.Logo).HasMaxLength(200);

                entity.Property(e => e.NombreComercial)
                    .IsRequired()
                    .HasColumnName("Nombre_comercial")
                    .HasMaxLength(50);

                entity.Property(e => e.NombreRepresentante)
                    .IsRequired()
                    .HasColumnName("Nombre_representante")
                    .HasMaxLength(50);

                entity.Property(e => e.TelRepresentante)
                    .IsRequired()
                    .HasColumnName("Tel_representante")
                    .HasMaxLength(8)
                    .IsFixedLength();
            });

            modelBuilder.Entity<PatrocinadorEvento>(entity =>
            {
                entity.ToTable("PATROCINADOR_EVENTO");

                entity.Property(e => e.IdEvento).HasColumnName("Id_evento");

                entity.Property(e => e.IdPatrocinador).HasColumnName("Id_patrocinador");

                entity.HasOne(d => d.IdEventoNavigation)
                    .WithMany(p => p.PatrocinadorEvento)
                    .HasForeignKey(d => d.IdEvento)
                    .HasConstraintName("PATROCINADOR_EVENTO_Id_evento_fkey");

                entity.HasOne(d => d.IdPatrocinadorNavigation)
                    .WithMany(p => p.PatrocinadorEvento)
                    .HasForeignKey(d => d.IdPatrocinador)
                    .HasConstraintName("PATROCINADOR_EVENTO_Id_patrocinador_fkey");
            });

            modelBuilder.Entity<Punto>(entity =>
            {
                entity.ToTable("PUNTO");

                entity.Property(e => e.Elevacion).HasColumnType("numeric(5,1)");

                entity.Property(e => e.IdRecorrido).HasColumnName("Id_recorrido");

                entity.Property(e => e.Latitud).HasColumnType("numeric(10,8)");

                entity.Property(e => e.Longitud).HasColumnType("numeric(10,8)");

                entity.HasOne(d => d.IdRecorridoNavigation)
                    .WithMany(p => p.Punto)
                    .HasForeignKey(d => d.IdRecorrido)
                    .HasConstraintName("PUNTO_Id_recorrido_fkey");
            });

            modelBuilder.Entity<Recorrido>(entity =>
            {
                entity.ToTable("RECORRIDO");

                entity.Property(e => e.FechaHora).HasColumnName("Fecha_hora");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Reto>(entity =>
            {
                entity.ToTable("RETO");

                entity.Property(e => e.IdEvento).HasColumnName("Id_evento");

                entity.Property(e => e.IdTipoReto).HasColumnName("Id_tipo_reto");

                entity.Property(e => e.Objetivo).HasColumnType("numeric(5,0)");

                entity.HasOne(d => d.IdEventoNavigation)
                    .WithMany(p => p.Reto)
                    .HasForeignKey(d => d.IdEvento)
                    .HasConstraintName("RETO_Id_evento_fkey");

                entity.HasOne(d => d.IdTipoRetoNavigation)
                    .WithMany(p => p.Reto)
                    .HasForeignKey(d => d.IdTipoReto)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("RETO_Id_tipo_reto_fkey");
            });

            modelBuilder.Entity<TipoActividad>(entity =>
            {
                entity.ToTable("TIPO_ACTIVIDAD");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<TipoEvento>(entity =>
            {
                entity.ToTable("TIPO_EVENTO");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<TipoReto>(entity =>
            {
                entity.ToTable("TIPO_RETO");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.User)
                    .HasName("USUARIO_pkey");

                entity.ToTable("USUARIO");

                entity.Property(e => e.User).HasMaxLength(30);

                entity.Property(e => e.Apellido1)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Apellido2)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.EsOrganizador).HasColumnName("Es_organizador");

                entity.Property(e => e.FechaNacimiento)
                    .HasColumnName("Fecha_nacimiento")
                    .HasColumnType("date");

                entity.Property(e => e.Foto).HasMaxLength(200);

                entity.Property(e => e.Nacionalidad)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(64);
            });

            modelBuilder.Entity<UsuarioAmigo>(entity =>
            {
                entity.ToTable("USUARIO_AMIGO");

                entity.Property(e => e.FechaAmigos)
                    .HasColumnName("Fecha_amigos")
                    .HasColumnType("date");

                entity.Property(e => e.IdAmigo)
                    .IsRequired()
                    .HasColumnName("Id_amigo")
                    .HasMaxLength(30);

                entity.Property(e => e.IdUsuario)
                    .IsRequired()
                    .HasColumnName("Id_usuario")
                    .HasMaxLength(30);

                entity.HasOne(d => d.IdAmigoNavigation)
                    .WithMany(p => p.UsuarioAmigoIdAmigoNavigation)
                    .HasForeignKey(d => d.IdAmigo)
                    .HasConstraintName("USUARIO_AMIGO_Id_amigo_fkey");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.UsuarioAmigoIdUsuarioNavigation)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("USUARIO_AMIGO_Id_usuario_fkey");
            });

            modelBuilder.Entity<UsuarioGrupo>(entity =>
            {
                entity.ToTable("USUARIO_GRUPO");

                entity.Property(e => e.IdGrupo).HasColumnName("Id_grupo");

                entity.Property(e => e.IdUsuario)
                    .IsRequired()
                    .HasColumnName("Id_usuario")
                    .HasMaxLength(30);

                entity.HasOne(d => d.IdGrupoNavigation)
                    .WithMany(p => p.UsuarioGrupo)
                    .HasForeignKey(d => d.IdGrupo)
                    .HasConstraintName("USUARIO_GRUPO_Id_grupo_fkey");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.UsuarioGrupo)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("USUARIO_GRUPO_Id_usuario_fkey");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
