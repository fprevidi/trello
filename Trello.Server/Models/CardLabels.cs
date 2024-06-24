using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class CardLabels
{
    public int LabelId { get; set; }

    public string Name { get; set; } = null!;

    public string Color { get; set; } = null!;

    public virtual ICollection<Cards> Card { get; set; } = new List<Cards>();
}
