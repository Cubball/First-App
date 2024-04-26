using FluentValidation;
using TaskBoard.BLL.Infrastructure;

namespace TaskBoard.BLL.Validation;

public static class DateTimeValidatorExtensions
{
    public static IRuleBuilderOptions<T, DateTime> InTheFuture<T>(
        this IRuleBuilder<T, DateTime> ruleBuilder,
        IDateTimeProvider dateTimeProvider)
    {
        return ruleBuilder
            .Must(d => d > dateTimeProvider.UtcNow)
            .WithMessage("{PropertyName} must be in the future");
    }
}