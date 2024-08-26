using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class Comments
{
    public int CommentId { get; set; }

    public int CardId { get; set; }

    public int UserId { get; set; }

    public string Text { get; set; } = null!;

    public Guid Uid { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? CreatedBy { get; set; } = null!;

    public virtual Cards Card { get; set; } = null!;

    public virtual Users User { get; set; } = null!;
}
