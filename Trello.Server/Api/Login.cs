using Trello.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

using System.Net.Mail;
using System.Net; // Per IEmailSender

namespace Trello.Server.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly TrelloContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
       
        public LoginController(TrelloContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }




        [HttpPost]
        public ActionResult<string> Login([FromBody] LoginRequest loginRequest)
        {
            var utente = _context.Users.FirstOrDefault(a => a.Username == loginRequest.username && a.Password == loginRequest.password);
            if (utente != null)
            {
                var token = GenerateJwtToken(utente); // Genera un token JWT per l'utente
                loginRequest.token = token;
                loginRequest.uid = utente.Uid.ToString();
                return Ok(loginRequest);
            }
            else
            {
                return BadRequest("Utente non trovato o password errata");
            }
        }
        [HttpPost("RecuperoPassword")]
        public ActionResult<string> RecuperoPassword([FromBody] LoginRequest loginRequest)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == loginRequest.username);
                if (user == null)
                {
                    return BadRequest("Email non trovata");
                }

                var recoveryToken = user.Uid.ToString(); // Implementa questa funzione secondo le tue necessità
                                                         // Salva il token nel database associato all'utente...


                string smtpServer = _configuration.GetSection("Smtp:Host").Value;
                string smtpUsername = _configuration.GetSection("Smtp:Username").Value;
                string smtpPassword = _configuration.GetSection("Smtp:Password").Value;





                // Send email to username with password
                var email = new MailMessage();
                email.From = new MailAddress("fprevidi@craon.it");
                email.To.Add(loginRequest.username);
                var domain = _httpContextAccessor.HttpContext.Request.Host.Value;

                email.Subject = "Questo il link dove impostare la password per la tua utenza";
                email.Body = $"Vai al link https://{domain}/ResetPassword?token={user.Uid}";

                using (var smtp = new SmtpClient(smtpServer))
                {
                    smtp.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
                    smtp.Send(email);
                }

                return Ok("OK");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message + " " + e.InnerException);
            }

        }
        [HttpPost("api/ResetPassword")]
        public ActionResult<string> ResetPassword([FromBody] LoginRequest loginRequest)
        {
            try
            {
                var user = _context.Users.FirstOrDefault(u => u.Uid.ToString() == loginRequest.token);
                if (user == null)
                {
                    return BadRequest("Token non valido");
                }

                user.Password = loginRequest.password;
                _context.SaveChanges();

                return Ok("Password aggiornata correttamente");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message + " " + e.InnerException);
            }

        }
 
        [HttpGet("/api/LoginEdit/{Uid:Guid}")]
        public ActionResult<string> LoginEdit(Guid Uid)
        {

            var utente = _context.Users.FirstOrDefault(a => a.Uid == Uid);
            //return 
            return Ok(utente);
  
        }
        [HttpPost("/api/LoginEdit")]
        public async Task<IActionResult> LoginEdit([FromForm] LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request");
            }



            // Cerca l'utente da modificare
            var utente = _context.Users.FirstOrDefault(a => a.Uid == Guid.Parse(request.uid));
            if (utente == null)
            {
                return NotFound("Utente non trovato");
            }
            utente.Name = request.name;
            utente.Username = request.username;
            _context.Update(utente);
           
            // Path della cartella dove salvare le foto
            string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot","Allegati", "FotoProfilo");

            // Crea la cartella se non esiste
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Nome del file
            string fileName = $"Profilo_{request.uid}.jpg";
            string filePath = Path.Combine(folderPath, fileName);

            try
            {
                // Salva l'immagine se è presente
                if (request.profilePic != null)
                {
                    // Converti la stringa base64 in byte[]
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.profilePic.CopyToAsync(stream);
                    }

                   
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Profilo modificato con successo" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Errore interno del server: {ex.Message}");
            }
        }

        // Metodo ipotetico per generare un token JWT, da implementare
        [NonAction]
        public string GenerateJwtToken(Users utente)
        {
            //retrieve FraseSegreta from appsettings.json
            var secret = _configuration.GetValue<string>("FraseToken");
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(secret); // Assicurati che questa chiave sia complessa e conservata in modo sicuro!

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, utente.Username),
            // Qui puoi aggiungere altri claims se necessario, come ruoli o altre informazioni dell'utente
        }),
                Expires = DateTime.UtcNow.AddDays(7), // Imposta la scadenza del token come preferisci
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }

    public class LoginRequest
    {
        public string? name { get; set; }
        public string? username { get; set; }
        public string? password { get; set; }
        public string? token { get; set; }
        public string? uid { get; set; }
        public IFormFile? profilePic { get; set; } // Aggiungi questa proprietà per il binario della foto
    }


}
