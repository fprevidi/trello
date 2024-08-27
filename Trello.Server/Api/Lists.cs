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


        public class insList
        {
            public Guid boardUid { get; set; }
            public string name { get; set; }
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
                var lists = await _context.Lists.Select(a => new
                {

                    a.Uid,
                    a.Name,
                    a.Position,
                    a.CreatedAt,
                    a.CreatedBy,
                    a.CreatedByName,
                    a.BoardId,
                    a.ListId,
                    Cards = a.Cards.OrderBy(a=>a.Position).ToList()
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
        public async Task<ActionResult<Lists>> ListCreate(insList inslist)
        {
            var list = new Lists();
            try
            {
                if (inslist.boardUid == Guid.Empty)
                {
                    return BadRequest("Board ID Vuoto");

                }
                var board = _context.Boards.FirstOrDefault(a => a.Uid == inslist.boardUid);
                if (board == null)
                {
                    return BadRequest("Board non trovata");

                }
              

                list.CreatedAt = DateTime.UtcNow;
                list.CreatedByName = _jwtService.GetUserName();
                list.CreatedBy = _jwtService.GetUserId();
                list.BoardId = board.BoardId;
                list.Name = inslist.name;
                list.Position = _context.Lists.Max(x => x.Position) > 0 ? _context.Lists.Max(x => x.Position) + 1 : 1;
                _context.Lists.Add(list);
                await _context.SaveChangesAsync();

                var listDto = new 
                {
                    Uid = list.Uid,
                    Name = list.Name,
                    Position = list.Position,
                    BoardId = list.BoardId

                    // Aggiungi altre proprietà necessarie
                };
                return Ok(listDto);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        
        }

        // DELETE: api/Lists/5
        [HttpGet("/api/ListDelete/{uid:Guid}")]
        public async Task<IActionResult> DeleteList(Guid uid)
        {
           
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