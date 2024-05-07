using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskBoard.DAL.Migrations
{
    /// <inheritdoc />
    public partial class CardStateAddListId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ListId",
                table: "CardStates",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ListId",
                table: "CardStates");
        }
    }
}
