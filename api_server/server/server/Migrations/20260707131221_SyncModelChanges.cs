using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace server.Migrations
{
    /// <inheritdoc />
    public partial class SyncModelChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Tickets",
                newName: "Title");

            migrationBuilder.Sql(
    @"ALTER TABLE ""Tickets"" ALTER COLUMN ""GlpiId"" TYPE integer USING ""GlpiId""::integer;");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Tickets",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Tickets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Tickets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Tickets",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Tickets",
                newName: "Name");

            migrationBuilder.Sql(
    @"ALTER TABLE ""Tickets"" ALTER COLUMN ""GlpiId"" TYPE text USING ""GlpiId""::text;");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Tickets",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
