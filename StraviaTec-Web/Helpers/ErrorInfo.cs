namespace StraviaTec_Web.Helpers
{
    public class ErrorInfo
    {
        public string Title { get; set; }
        public int Status { get; set; }
        public string Message { get; set; }

        public ErrorInfo() {}

        public ErrorInfo(int code, string message) {
            this.Status = code;
            this.Title = ErrorMsg.Get(code);
            this.Message = message;
        }
    }
}