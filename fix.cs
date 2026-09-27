using System;
using System.IO;
using System.Text;

class Program {
    static void Main() {
        string text = File.ReadAllText("d:/Dev/x5m/index.html", Encoding.UTF8);
        Encoding thai = Encoding.GetEncoding(874);
        byte[] bytes = thai.GetBytes(text);
        string original = Encoding.UTF8.GetString(bytes);
        File.WriteAllText("d:/Dev/x5m/index.html", original, new UTF8Encoding(false));
    }
}
