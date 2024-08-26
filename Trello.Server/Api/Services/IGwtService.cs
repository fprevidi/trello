using Trello.Server.Models;

namespace Trello.Server.Services
{
    public interface IJwtService
    {
        string GenerateJwtToken(Users user);
        string GetUserName();
        int GetUserId();
    }
}
