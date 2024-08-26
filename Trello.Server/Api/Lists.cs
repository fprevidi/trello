using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Trello.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Trello.Server.Services;

namespace Trello.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListsController : ControllerBase
    {
        private readonly TrelloContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IJwtService _jwtService;

        public ListsController(TrelloContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IJwtService jwtService)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _jwtService = jwtService;
        }

        // GET: api/Lists?cardId=1
        [HttpGet("/api/GetLists/{uid:Guid}")]
        public async Task<ActionResult<IEnumerable<Lists>>> GetLists(Guid Uid)
        {
            try
            {
                int boardId = _context.Boards.FirstOrDefault(a => a.Uid == Uid).BoardId;

                if (_context.Lists == null)
                {
                    return NotFound();
                }
                var lists = await _context.Lists.Include(a => a.Cards).Select(a => new
                {

                    a.Uid,
                    a.Name,
                    a.Position,
                    a.CreatedAt,
                    a.CreatedBy,
                    a.CreatedByName,
                    a.BoardId,
                    a.ListId,
                    a.Cards
                }).Where(a => a.BoardId == boardId).ToListAsync();
                if (lists != null)
                {
                    return Ok(lists);
                }
                else
                {
                    return NoContent();
                }

            } catch (Exception ex)
            {
                throw ex;
            }
        }

        // POST: api/Lists

        [HttpPost("/api/ListCreate")]
        public async Task<ActionResult<Lists>> ListCreate(Lists list)
        {
            if (_context.Lists == null)
            {
                return Problem("Entity set 'TrelloContext.Lists' is null.");
            }

            list.CreatedAt = DateTime.UtcNow;
            list.CreatedByName = _jwtService.GetUserName();
            list.CreatedBy = _jwtService.GetUserId();
            _context.Lists.Add(list);
            await _context.SaveChangesAsync();

            return Ok("OK");
        }

        // DELETE: api/Lists/5
        [HttpGet("/api/List/Delete/{uid:Guid}")]
        public async Task<IActionResult> DeleteList(Guid uid)
        {
            if (_context.Lists == null)
            {
                return NotFound();
            }

            var list = _context.Lists.FirstOrDefault(a => a.Uid == uid);
            if (list == null)
            {
                return NotFound();
            }

            _context.Lists.Remove(list);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ListExists(int id)
        {
            return (_context.Lists?.Any(e => e.ListId == id)).GetValueOrDefault();
        }
    }
}