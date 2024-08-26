using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trello.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Trello.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly TrelloContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CommentsController(TrelloContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/Comments?cardId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comments>>> GetComments([FromQuery] int cardId)
        {
            if (_context.Comments == null)
            {
                return NotFound();
            }

            return await _context.Comments
                .Where(c => c.CardId == cardId)
                .ToListAsync();
        }

        // POST: api/Comments
      
        [HttpPost("/api/CommentCreate")]
        public async Task<ActionResult<Comments>> CommentCreate(Comments comment)
        {
            if (_context.Comments == null)
            {
                return Problem("Entity set 'TrelloContext.Comments' is null.");
            }

            comment.CreatedAt = DateTime.UtcNow;
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok("OK");

        }

        // DELETE: api/Comments/5
        [HttpGet("/api/Comment/Delete/{uid:Guid}")]
        public async Task<IActionResult> DeleteComment(Guid uid)
        {
            if (_context.Comments == null)
            {
                return NotFound();
            }

            var comment = _context.Comments.FirstOrDefault(a=>a.Uid == uid);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(int id)
        {
            return (_context.Comments?.Any(e => e.CommentId == id)).GetValueOrDefault();
        }
    }
}
