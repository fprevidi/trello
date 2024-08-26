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
    public class BoardsController : ControllerBase
    {
        private readonly TrelloContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BoardsController(TrelloContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/Boards?cardId=1
        [HttpGet("/api/GetBoards")]
        public async Task<ActionResult<IEnumerable<Boards>>> GetBoards()
        {
            if (_context.Boards == null)
            {
                return NotFound();
            }

            return await _context.Boards             
                .ToListAsync();
        }

        // POST: api/Boards
      
        [HttpPost("/api/BoardCreate")]
        public async Task<ActionResult<Boards>> BoardCreate(Boards board)
        {
            if (_context.Boards == null)
            {
                return Problem("Entity set 'TrelloContext.Boards' is null.");
            }

            board.CreatedAt = DateTime.UtcNow;
            _context.Boards.Add(board);
            await _context.SaveChangesAsync();

            return Ok("OK");

        }

        // DELETE: api/Boards/5
        [HttpGet("/api/Board/Delete/{uid:Guid}")]
        public async Task<IActionResult> DeleteBoard(Guid uid)
        {
            if (_context.Boards == null)
            {
                return NotFound();
            }

            var board = _context.Boards.FirstOrDefault(a=>a.Uid == uid);
            if (board == null)
            {
                return NotFound();
            }

            _context.Boards.Remove(board);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BoardExists(int id)
        {
            return (_context.Boards?.Any(e => e.BoardId == id)).GetValueOrDefault();
        }
    }
}
