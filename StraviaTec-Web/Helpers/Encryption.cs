
using System.Security.Cryptography;
using System.Text;

namespace StraviaTec_Web.Helpers 
{
    public static class Encryption
    {
        public static string EncryptSha256(string input)
        {
            string hashString;
            using (var sha256 = SHA256Managed.Create())
            {
                var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                hashString = ToHex(hash, false);
            }

            return hashString;
        }

        public static bool Equals(string nonEncrypted, string encrypted) {
            return encrypted.Equals(EncryptSha256(nonEncrypted));
        }

        private static string ToHex(byte[] input, bool uppercase) 
        {
            var result = new StringBuilder(input.Length * 2);
            for (int i = 0; i < input.Length; i++)
            {
                result.Append(input[i].ToString(uppercase ? "X2" : "x2"));
            }

            return result.ToString();
        }
    }
}