using Dapper;
using Microsoft.AspNetCore.Mvc;
using MISA.CukCuk.Internship.Entities;
using MySqlConnector;
using Swashbuckle.AspNetCore.Annotations;

namespace MISA.CukCuk.Internship.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class PositionsController : ControllerBase
    {
        /// <summary>
        /// API Lấy toàn bộ danh sách vị trí, tìm kiếm
        /// </summary>
        /// <returns>Danh sách vị trí</returns>
        /// Created by: LTTRUNG (25/07/2022)
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(List<Position>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult FilterPositions([FromQuery] string? positionName)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Position_GetPosition";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();

                var whereConditions = new List<string>();

                // Kiểm tra tham số đầu vào
                if (!string.IsNullOrEmpty(positionName)) {
                    whereConditions.Add($"Where p.PositionName LIKE \'%{positionName}%\'");
                } 
                else {
                    whereConditions.Add($"Where 1 = 1");
                }

                string whereClause = string.Join("", whereConditions);

                parameters.Add("@$Where", whereClause);

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                var positions = mySqlConnection.Query<Position>(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý dữ liệu trả về từ DB
                if (positions != null)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, positions);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
    }
}
