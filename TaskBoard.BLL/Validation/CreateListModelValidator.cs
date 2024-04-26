using FluentValidation;
using TaskBoard.BLL.Models.List;

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