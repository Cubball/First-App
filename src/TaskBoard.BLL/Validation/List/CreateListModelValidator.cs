using FluentValidation;
using TaskBoard.BLL.Models.List;

namespace TaskBoard.BLL.Validation.List;

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