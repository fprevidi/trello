using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class ChecklistItems
{
    public int ChecklistItemId { get; set; }

    public int ChecklistId { get; set; }

    public string Name { get; set; } = null!;

    public bool IsCompleted { get; set; }

    public virtual Checklists Checklist { get; set; } = null!;
}
