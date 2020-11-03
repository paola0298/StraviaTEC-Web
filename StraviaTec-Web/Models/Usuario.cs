using System;
using System.Collections.Generic;

namespace StraviaTec_Web.Models
{
    public partial class Usuario
    {
        public Usuario()
        {
            Actividad = new HashSet<Actividad>();
            Grupo = new HashSet<Grupo>();
            InscripcionEvento = new HashSet<InscripcionEvento>();
            UsuarioAmigoIdAmigoNavigation = new HashSet<UsuarioAmigo>();
            UsuarioAmigoIdUsuarioNavigation = new HashSet<UsuarioAmigo>();
            UsuarioGrupo = new HashSet<UsuarioGrupo>();
        }

        public string User { get; set; }
        public string Password { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Nacionalidad { get; set; }
        public string Foto { get; set; }
        public bool EsOrganizador { get; set; }

        public virtual ICollection<Actividad> Actividad { get; set; }
        public virtual ICollection<Grupo> Grupo { get; set; }
        public virtual ICollection<InscripcionEvento> InscripcionEvento { get; set; }
        public virtual ICollection<UsuarioAmigo> UsuarioAmigoIdAmigoNavigation { get; set; }
        public virtual ICollection<UsuarioAmigo> UsuarioAmigoIdUsuarioNavigation { get; set; }
        public virtual ICollection<UsuarioGrupo> UsuarioGrupo { get; set; }
    }
}
