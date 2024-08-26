using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Trello.Server.Models;

public partial class TrelloContext : DbContext
{
    public TrelloContext()
    {
    }

    public TrelloContext(DbContextOptions<TrelloContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Attachments> Attachments { get; set; }

    public virtual DbSet<Boards> Boards { get; set; }

    public virtual DbSet<CardLabels> CardLabels { get; set; }

    public virtual DbSet<Cards> Cards { get; set; }

    public virtual DbSet<ChecklistItems> ChecklistItems { get; set; }

    public virtual DbSet<Checklists> Checklists { get; set; }

    public virtual DbSet<Comments> Comments { get; set; }

    public virtual DbSet<Lists> Lists { get; set; }

    public virtual DbSet<Users> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=172.31.118.105;Database=Trello;User Id=TrelloUser;Password=!c0zz32024;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Attachments>(entity =>
        {
            entity.HasKey(e => e.AttachmentId).HasName("PK__Attachme__442C64BE12127190");

            entity.Property(e => e.FilePath).HasMaxLength(255);
            entity.Property(e => e.UploadedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Card).WithMany(p => p.Attachments)
                .HasForeignKey(d => d.CardId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Attachmen__CardI__4316F928");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Attachments)
                .HasForeignKey(d => d.UploadedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Attachmen__Uploa__440B1D61");
        });

        modelBuilder.Entity<Boards>(entity =>
        {
            entity.HasKey(e => e.BoardId).HasName("PK__Boards__F9646BF213E751B0");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Uid).HasDefaultValueSql("(NEWID())");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Boards)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Boards__CreatedB__267ABA7A");
        });

        modelBuilder.Entity<CardLabels>(entity =>
        {
            entity.HasKey(e => e.LabelId).HasName("PK__CardLabe__397E2BC31879E5B9");

            entity.Property(e => e.Color).HasMaxLength(7);
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Cards>(entity =>
        {
            entity.HasKey(e => e.CardId).HasName("PK__Cards__55FECDAEBD531C05");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Uid)
                .HasDefaultValueSql("(NEWID())");
            entity.Property(e => e.DueDate).HasColumnType("datetime");
            entity.Property(e => e.Title).HasMaxLength(100);

            entity.HasOne(d => d.CreatedByNavigation).WithMany(p => p.Cards)
                .HasForeignKey(d => d.CreatedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cards__CreatedBy__2E1BDC42");

            entity.HasOne(d => d.List).WithMany(p => p.Cards)
                .HasForeignKey(d => d.ListId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cards__ListId__2D27B809");

            entity.HasMany(d => d.Label).WithMany(p => p.Card)
                .UsingEntity<Dictionary<string, object>>(
                    "CardLabelAssignments",
                    r => r.HasOne<CardLabels>().WithMany()
                        .HasForeignKey("LabelId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__CardLabel__Label__33D4B598"),
                    l => l.HasOne<Cards>().WithMany()
                        .HasForeignKey("CardId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__CardLabel__CardI__32E0915F"),
                    j =>
                    {
                        j.HasKey("CardId", "LabelId").HasName("PK__CardLabe__76692F12457C50B5");
                    });
        });

        modelBuilder.Entity<ChecklistItems>(entity =>
        {
            entity.HasKey(e => e.ChecklistItemId).HasName("PK__Checklis__407798ED0D39486B");

            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.Checklist).WithMany(p => p.ChecklistItems)
                .HasForeignKey(d => d.ChecklistId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checklist__Check__3A81B327");
        });

        modelBuilder.Entity<Checklists>(entity =>
        {
            entity.HasKey(e => e.ChecklistId).HasName("PK__Checklis__4C1D499AF9972E7A");

            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.Card).WithMany(p => p.Checklists)
                .HasForeignKey(d => d.CardId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Checklist__CardI__36B12243");
        });

        modelBuilder.Entity<Comments>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__Comments__C3B4DFCA3ACCBEE8");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.Property(e => e.Uid)
                .HasDefaultValueSql("(NEWID())");

            entity.HasOne(d => d.Card).WithMany(p => p.Comments)
                .HasForeignKey(d => d.CardId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comments__CardId__3E52440B");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comments__UserId__3F466844");
        });

        modelBuilder.Entity<Lists>(entity =>
        {
            entity.HasKey(e => e.ListId).HasName("PK__Lists__E3832805E2870519");

            entity.Property(e => e.Name).HasMaxLength(100);

            entity.HasOne(d => d.Board).WithMany(p => p.Lists)
                .HasForeignKey(d => d.BoardId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Lists__BoardId__29572725");
            entity.Property(e => e.Uid).HasDefaultValueSql("(NEWID())");
        });

        modelBuilder.Entity<Users>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4CFE3A0463");

            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Username).HasMaxLength(50);
            entity.Property(e => e.Uid).HasDefaultValueSql("(NEWID())");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
