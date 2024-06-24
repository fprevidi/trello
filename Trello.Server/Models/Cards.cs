using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class Cards
{
    public int CardId { get; set; }

    public int ListId { get; set; }

    public string Title { get; set; } = null!;

    public string? Description { get; set; }

    public int Position { get; set; }

    public DateTime? DueDate { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Attachments> Attachments { get; set; } = new List<Attachments>();

    public virtual ICollection<Checklists> Checklists { get; set; } = new List<Checklists>();

    public virtual ICollection<Comments> Comments { get; set; } = new List<Comments>();

    public virtual Users CreatedByNavigation { get; set; } = null!;

    public virtual Lists List { get; set; } = null!;

    public virtual ICollection<CardLabels> Label { get; set; } = new List<CardLabels>();
}
