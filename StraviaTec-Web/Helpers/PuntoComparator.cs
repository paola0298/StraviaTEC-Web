using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using StraviaTec_Web.Models;

namespace StraviaTec_Web.Helpers
{
    public class PuntoComparator : IComparer<Punto>
    {
        public int Compare([AllowNull] Punto x, [AllowNull] Punto y)
        {
            if (x == null || y == null)
            {
                return 0;
            }

            if (x.Orden < y.Orden)
            {
                return -1;
            }
            else if (x.Orden > y.Orden)
            {
                return 1;
            }
            return 0;
        }
    }
}