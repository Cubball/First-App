using ErrorOr;
using FluentValidation.Results;

namespace TaskBoard.BLL.Mapping;

public static class ValidationResultMappingExtensions
{
    public static ErrorOr<TResult> ToValidationErrors<TResult>(this ValidationResult validationResult)
    {
        return validationResult.Errors.ConvertAll(vf => Error.Validation(vf.PropertyName, vf.ErrorMessage));
    }
}