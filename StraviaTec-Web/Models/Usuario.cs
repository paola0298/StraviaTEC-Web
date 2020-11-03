using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace StraviaTec_Web.Models
{
    public partial class Usuario
    {
        [Key]
        public string User { get; set; }
        public string Password { get; set; }
        public string Nombre { get; set; }
        public string Apellido1 { get; set; }
        public string Apellido2 { get; set; }
        public DateTime Fecha_nacimiento { get; set; }
        public string Nacionalidad { get; set; }
        public string Foto { get; set; }

        public override bool Equals(object obj)
        {
            if (obj is Usuario usr) {
                return usr.User == this.User;
            }

            return false;
        }
    }
}
