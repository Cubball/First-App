using FluentValidation;
using TaskBoard.BLL.Infrastructure;
using TaskBoard.BLL.Models.Card;

namespace TaskBoard.BLL.Validation;

public class CreateCardModelValidator : AbstractValidator<CreateCardModel>
{
    public CreateCardModelValidator(IDateTimeProvider dateTimeProvider)
    {
        RuleFor(c => c.Name)
            .NotNull()
            .NotEmpty()
            .Length(2, 100);
        RuleFor(c => c.Description)
            .NotNull()
            .MaximumLength(1000);
        RuleFor(c => c.DueDate)
            .InTheFuture(dateTimeProvider)
            .UtcKind();
        RuleFor(c => c.Priority)
            .ValidPriority();
    }
}