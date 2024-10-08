﻿using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class Lists
{
    public int ListId { get; set; }

    public int BoardId { get; set; }

    public string Name { get; set; } = null!;

    public int Position { get; set; }

    public DateTime CreatedAt { get; set; }
    public int CreatedBy { get; set; } 
    public string? CreatedByName { get; set; }
    public Guid Uid { get; set; }

    public virtual Boards Board { get; set; } = null!;

    public virtual ICollection<Cards> Cards { get; set; } = new List<Cards>();
}
