using TruckAppStore.DB; 
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
     c.SwaggerDoc("v1", new OpenApiInfo { Title = "TruckApp API", Description = "Tracking trucking expenses", Version = "v1" });
});

var app = builder.Build();
app.UseCors(builder => builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
if (app.Environment.IsDevelopment())
{
   app.UseSwagger();
   app.UseSwaggerUI(c =>
   {
      c.SwaggerEndpoint("/swagger/v1/swagger.json", "TruckApp API V1");
   });
}

app.MapGet("/expenses", () => ExpenseDB.GetExpenses());
app.MapGet("/expense-types", () => ExpenseDB.GetExpenseTypes());
app.MapPost("/expense", (Expense expense) => ExpenseDB.CreateExpense(expense));
app.MapPut("/expense", (Expense expense) => ExpenseDB.UpdateExpense(expense));
app.MapDelete("/expense/{id}", (int id) => ExpenseDB.RemoveExpense(id));

app.Run();
