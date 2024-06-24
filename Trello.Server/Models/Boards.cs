using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class Boards
{
    public int BoardId { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Users CreatedByNavigation { get; set; } = null!;

    public virtual ICollection<Lists> Lists { get; set; } = new List<Lists>();
}
