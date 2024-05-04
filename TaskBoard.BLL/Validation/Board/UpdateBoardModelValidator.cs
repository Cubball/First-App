using FluentValidation;
using TaskBoard.BLL.Models.Board;

namespace TaskBoard.BLL.Validation.Board;

public class UpdateBoardModelValidator : AbstractValidator<UpdateBoardModel>
{
    public UpdateBoardModelValidator()
    {
        RuleFor(b => b.Name)
            .NotNull()
            .NotEmpty()
            .Length(2, 100);
    }
}