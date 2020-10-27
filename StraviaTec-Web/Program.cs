using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace StraviaTec_Web
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .AddCommandLine(args)
                .Build();
            
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseUrls("http://127.0.0.1:5001", "http://0.0.0.0:5001")
                .UseIISIntegration()
                .UseStartup<Startup>()
                .Build();
            
            host.Run();
        }
    }
}
