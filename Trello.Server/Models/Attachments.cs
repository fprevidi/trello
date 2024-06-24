using System;
using System.Collections.Generic;

namespace Trello.Server.Models;

public partial class Attachments
{
    public int AttachmentId { get; set; }

    public int CardId { get; set; }

    public string FilePath { get; set; } = null!;

    public int UploadedBy { get; set; }

    public DateTime UploadedAt { get; set; }

    public virtual Cards Card { get; set; } = null!;

    public virtual Users UploadedByNavigation { get; set; } = null!;
}
