using FluentValidation;
using TaskBoard.BLL.Models;

namespace TaskBoard.BLL.Validation;

public class CreateListModelValidator : AbstractValidator<CreateListModel>
{
    public CreateListModelValidator()
    {
        RuleFor(l => l.Name)
            .NotNull()
            .NotEmpty()
            .Length(2, 100);
    }
}