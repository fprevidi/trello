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
    public class CardsController : ControllerBase
    {
        private readonly TrelloContext _context;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IJwtService _jwtService;


        public CardsController(TrelloContext context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IJwtService jwtService)
        {
            _context = context;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _jwtService = jwtService;
        }
        public class tmpCard
        {
            public Guid ListUid { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
        }

        // P
        // GET: api/Cards?cardId=1
        [HttpGet("/api/GetCards/{uid:Guid}")]
        public async Task<ActionResult<IEnumerable<Cards>>> GetCards(Guid Uid)
        {
            try
            {
                int boardId = _context.Boards.FirstOrDefault(a => a.Uid == Uid).BoardId;

                if (_context.Cards == null)
                {
                    return NotFound();
                }
                var cards = await _context.Cards.Include(a => a.List).Select(a => new
                {

                    a.Uid,
                    a.Title,
                    a.Description,
                    a.Position,
                    a.CreatedAt,
                    a.CreatedBy,
                    a.CreatedByName,
                    a.ListId,
                    a.CardId,
                    boardId = a.List.BoardId,
                    ListUid = a.List.Uid
                  
                }).Where(a => a.boardId == boardId).ToListAsync();
                if (cards != null)
                {
                    return Ok(cards);
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

        // POST: api/Cards

        [HttpPost("/api/CardCreate")]
        public async Task<ActionResult<Cards>> CardCreate(tmpCard card)
        {
            if (_context.Cards == null)
            {
                return Problem("Entity set 'TrelloContext.Cards' is null.");
            }
            var listId = _context.Lists.FirstOrDefault(a => a.Uid == card.ListUid).ListId;
            var newCard = new Cards();
            newCard.ListId = listId;

            newCard.Title = card.Title;
            newCard.Description = card.Description;
            newCard.Position = 0;



            newCard.CreatedAt = DateTime.UtcNow;
            newCard.CreatedByName = _jwtService.GetUserName();
            newCard.CreatedBy = _jwtService.GetUserId();
            newCard.Uid = Guid.NewGuid();
            _context.Cards.Add(newCard);
            await _context.SaveChangesAsync();

            return Ok("OK");
        }
        
        [HttpPost("/api/CardEdit")]
        public async Task<ActionResult<Cards>> CardEdit(Cards card)
        {
            if (_context.Cards == null)
            {
                return Problem("Entity set 'TrelloContext.Cards' is null.");
            }
            var cardEdit = _context.Cards.FirstOrDefault(a => a.Uid == card.Uid);
            if (cardEdit == null)
            {
                return NotFound();
            }
            cardEdit.Title = card.Title;
            cardEdit.Description = card.Description;
            cardEdit.Position = card.Position;
            cardEdit.DueDate = card.DueDate;
            cardEdit.CreatedAt = DateTime.UtcNow;
            cardEdit.CreatedByName = _jwtService.GetUserName();
            cardEdit.CreatedBy = _jwtService.GetUserId();
            _context.Cards.Update(cardEdit);
            await _context.SaveChangesAsync();

            return Ok("OK");
        }

        // DELETE: api/Cards/5
        [HttpGet("/api/Card/Delete/{uid:Guid}")]
        public async Task<IActionResult> DeleteCard(Guid uid)
        {
            if (_context.Cards == null)
            {
                return NotFound();
            }

            var card = _context.Cards.FirstOrDefault(a => a.Uid == uid);
            if (card == null)
            {
                return NotFound();
            }

            _context.Cards.Remove(card);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CardExists(int id)
        {
            return (_context.Cards?.Any(e => e.CardId == id)).GetValueOrDefault();
        }

        
      
    }
   

  
    }