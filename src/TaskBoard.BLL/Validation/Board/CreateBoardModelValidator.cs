using FluentValidation;
using TaskBoard.BLL.Models.Board;

namespace TaskBoard.BLL.Validation.Board;

public class CreateBoardModelValidator : AbstractValidator<CreateBoardModel>
{
    public CreateBoardModelValidator()
    {
        RuleFor(b => b.Name)
            .NotNull()
            .NotEmpty()
            .Length(2, 100);
    }
}