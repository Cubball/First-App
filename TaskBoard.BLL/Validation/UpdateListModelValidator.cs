using FluentValidation;
using TaskBoard.BLL.Models;

namespace TaskBoard.BLL.Validation;

public class UpdateListModelValidator : AbstractValidator<UpdateListModel>
{
    public UpdateListModelValidator()
    {
        RuleFor(l => l.Name)
            .NotNull()
            .NotEmpty()
            .Length(2, 100);
    }
}