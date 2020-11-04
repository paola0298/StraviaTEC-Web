namespace StraviaTec_Web.Helpers
{
    public static class ErrorCode 
    {
        //Success codes
        public const int Ok = 200;
        public const int Created = 201;
        public const int NoContent = 204;

        //Client error codes
        public const int BadRequest = 400;
        public const int Forbidden = 403;
        public const int NotFound = 404;
        public const int Conflict = 409;

        //Server error codes
        public const int InternalServerError = 500;
        public const int NotImplemented = 501;
    }

    public static class ErrorMsg {
        
        public static string Get(int code) {
            switch (code)
            {
                case ErrorCode.Ok:
                    return "Ok";
                case ErrorCode.Created:
                    return "Created";
                case ErrorCode.NoContent:
                    return "No Content";
                case ErrorCode.BadRequest:
                    return "Bad Request";
                case ErrorCode.Forbidden:
                    return "Forbidden";
                case ErrorCode.NotFound:
                    return "Not Found";
                case ErrorCode.Conflict:
                    return "Conflict";
                case ErrorCode.InternalServerError:
                    return "Internal Server Error";
                case ErrorCode.NotImplemented:
                    return "Not Implemented";
                default:
                    return "Unknown";
            }
        }
    }
}