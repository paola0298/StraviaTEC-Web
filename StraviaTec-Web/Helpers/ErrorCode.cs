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
            return code switch
            {
                ErrorCode.Ok => "Ok",
                ErrorCode.Created => "Created",
                ErrorCode.NoContent => "No Content",
                ErrorCode.BadRequest => "Bad Request",
                ErrorCode.Forbidden => "Forbidden",
                ErrorCode.NotFound => "Not Found",
                ErrorCode.Conflict => "Conflict",
                ErrorCode.InternalServerError => "Internal Server Error",
                ErrorCode.NotImplemented => "Not Implemented",
                _ => "Unknown",
            };
        }
    }
}