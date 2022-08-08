using Dapper;
using Microsoft.AspNetCore.Mvc;
using MISA.CukCuk.Internship.Entities;
using MySqlConnector;
using Swashbuckle.AspNetCore.Annotations;

namespace MISA.CukCuk.Internship.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        /// <summary>
        /// API Lấy toàn bộ danh sách phòng ban, tìm kiếm
        /// </summary>
        /// <returns>Danh sách phòng ban</returns>
        /// Created by: LTTRUNG (25/07/2022)
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(List<Department>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult FilterPositions([FromQuery] string? departmentName)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Department_GetDepartment";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();

                var whereConditions = new List<string>();

                // Kiểm tra tham số đầu vào
                if (!string.IsNullOrEmpty(departmentName))
                {
                    whereConditions.Add($"Where dp.DepartmentName LIKE \'%{departmentName}%\'");
                }
                else
                {
                    whereConditions.Add($"Where 1 = 1");
                }

                string whereClause = string.Join("", whereConditions);

                parameters.Add("@$Where", whereClause);

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                var departments = mySqlConnection.Query<Department>(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý dữ liệu trả về từ DB
                if (departments != null)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, departments);
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
