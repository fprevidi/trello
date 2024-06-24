using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class Checklists
{
    public int ChecklistId { get; set; }

    public int CardId { get; set; }

    public string Name { get; set; } = null!;

    public virtual Cards Card { get; set; } = null!;

    public virtual ICollection<ChecklistItems> ChecklistItems { get; set; } = new List<ChecklistItems>();
}
