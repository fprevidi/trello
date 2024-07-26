using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class Users
{
    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;
    public Guid Uid { get; set; } 

    public virtual ICollection<Attachments> Attachments { get; set; } = new List<Attachments>();

    public virtual ICollection<Boards> Boards { get; set; } = new List<Boards>();

    public virtual ICollection<Cards> Cards { get; set; } = new List<Cards>();

    public virtual ICollection<Comments> Comments { get; set; } = new List<Comments>();
}
