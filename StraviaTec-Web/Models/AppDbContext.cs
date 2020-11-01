using Microsoft.EntityFrameworkCore;

namespace StraviaTec_Web.Models
{
    public class AppDbContext: DbContext
    {
        public AppDbContext() 
        {

        }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) 
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=StraviaTEC;Username=StraviaUser;Password=StraviaTEC_2020;");
            }
        }

        public DbSet<Usuario> USUARIO { get; set; }
    }
}