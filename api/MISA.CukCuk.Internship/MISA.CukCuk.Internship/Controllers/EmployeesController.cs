using Dapper;
using Microsoft.AspNetCore.Mvc;
using MISA.CukCuk.Internship.DTO;
using MISA.CukCuk.Internship.Entities;
using MySqlConnector;
using Swashbuckle.AspNetCore.Annotations;
using System.Data;

namespace MISA.CukCuk.Internship.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        /// <summary>
        /// API Lấy danh sách nhân viên cho phép lọc và phân trang
        /// </summary>
        /// <param name="code">Mã nhân viên</param>
        /// <param name="name">Tên nhân viên</param>
        /// <param name="phoneNumber">Số điện thoại</param>
        /// <param name="positionID">ID vị trí</param>
        /// <param name="departmentID">ID phòng ban</param>
        /// <param name="pageSize">Số trang muốn lấy</param>
        /// <param name="pageNumber">Thứ tự trang muốn lấy</param>
        /// <returns>Một đối tượng gồm:
        /// + Danh sách nhân viên thỏa mãn điều kiện lọc và phân trang
        /// + Tổng số nhân viên thỏa mãn điều kiện</returns>
        /// Created by: LTTRUNG (25/07/2022)
        [HttpGet]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(PagingData<Employee>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult FilterEmployees([FromQuery] string? code, [FromQuery] string? name, [FromQuery] string? phoneNumber,
            [FromQuery] Guid? positionID, [FromQuery] Guid? departmentID, [FromQuery] int pageSize = 10, [FromQuery] int pageNumber = 1)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Employee_GetPaging";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$Skip", (pageNumber - 1) * pageSize);
                parameters.Add("@$Take", pageSize);
                parameters.Add("@$Sort", "ModifiedDate DESC");

                var whereAndConditions = new List<string>();
                var whereOrConditions = new List<string>();
                if (code != null)
                {
                    whereOrConditions.Add($"EmployeeCode LIKE \'%{code}%\'");
                }
                if (name != null)
                {
                    whereOrConditions.Add($"EmployeeName LIKE \'%{name}%\'");
                }
                if (phoneNumber != null)
                {
                    whereOrConditions.Add($"PhoneNumber LIKE \'%{phoneNumber}%\'");
                }
                if (positionID != null)
                {
                    whereAndConditions.Add($"PositionID LIKE \'%{positionID}%\'");
                }
                if (departmentID != null)
                {
                    whereAndConditions.Add($"DepartmentID LIKE \'%{departmentID}%\'");
                }

                if (code == null && name == null && phoneNumber == null && positionID == null && departmentID == null)
                {
                    parameters.Add("@$Where", "");

                }

                else
                if (positionID == null && departmentID == null)
                {
                    var addConditions = new List<string>();
                    addConditions.Add("Where ");
                    string whereOrClause = string.Join(" OR ", whereOrConditions);
                    addConditions.Add(whereOrClause);
                    string result = string.Join("", addConditions);
                    parameters.Add("@$Where", result);
                }
                else if (code == null && name == null && phoneNumber == null)
                {
                    var addConditions = new List<string>();
                    addConditions.Add("Where ");
                    string whereOrClause = string.Join(" AND ", whereAndConditions);
                    addConditions.Add(whereOrClause);
                    string result = string.Join("", addConditions);
                    parameters.Add("@$Where", result);
                }
                else
                {
                    var addConditions = new List<string>();
                    addConditions.Add("Where (");
                    string whereAndClause = string.Join(" AND ", whereAndConditions);
                    string whereOrClause = string.Join(" OR ", whereOrConditions);
                    addConditions.Add(whereOrClause);
                    addConditions.Add(") AND ");
                    addConditions.Add(whereAndClause);
                    string result = string.Join("", addConditions);
                    parameters.Add("@$Where", result);
                }


                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                var multipleResults = mySqlConnection.QueryMultiple(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý kết quả trả về từ DB
                if (multipleResults != null)
                {
                    var employees = multipleResults.Read<Employee>();
                    var totalCount = multipleResults.Read<long>().Single();
                    return StatusCode(StatusCodes.Status200OK, new PagingData<Employee>()
                    {
                        Data = employees.ToList(),
                        TotalCount = totalCount
                    });
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Lấy thông tin chi tiết của 1 nhân viên
        /// </summary>
        /// <param name="employeeID">ID của nhân viên muốn lấy thông tin chi tiết</param>
        /// <returns>Đối tượng nhân viên muốn lấy thông tin chi tiết</returns>
        /// Created by: LTTRUNG (25/07/2022)
        [HttpGet("{employeeID}")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(Employee))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult GetEmployeeByID([FromRoute] Guid employeeID)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Employee_GetByEmployeeID";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$EmployeeID", employeeID);

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                var employee = mySqlConnection.QueryFirstOrDefault<Employee>(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý kết quả trả về từ DB
                if (employee != null)
                {
                    return StatusCode(StatusCodes.Status200OK, employee);
                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound);
                }
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Thêm mới 1 nhân viên
        /// </summary>
        /// <param name="employee">Đối tượng nhân viên muốn thêm mới</param>
        /// <returns>ID của nhân viên vừa thêm mới</returns>

        [HttpPost]
        [SwaggerResponse(StatusCodes.Status201Created, type: typeof(Guid))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult InsertEmployee([FromBody] Employee employee)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Employee_InsertUpdateEmployee";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var employeeID = Guid.NewGuid();
                var parameters = new DynamicParameters();
                parameters.Add("@$EmployeeID", employeeID);
                parameters.Add("@$ImageUrl", employee.ImageUrl);
                parameters.Add("@$EmployeeCode", employee.EmployeeCode);
                parameters.Add("@$EmployeeName", employee.EmployeeName);
                parameters.Add("@$DateOfBirth", employee.DateOfBirth);
                parameters.Add("@$Gender", employee.Gender);
                parameters.Add("@$IdentityNumber", employee.IdentityNumber);
                parameters.Add("@$IdentityIssuedPlace", employee.IdentityIssuedPlace);
                parameters.Add("@$IdentityIssuedDate", employee.IdentityIssuedDate);
                parameters.Add("@$Email", employee.Email);
                parameters.Add("@$PhoneNumber", employee.PhoneNumber);
                parameters.Add("@$PositionID", employee.PositionID);
                parameters.Add("@$DepartmentID", employee.DepartmentID);
                parameters.Add("@$TaxCode", employee.TaxCode);
                parameters.Add("@$Salary", employee.Salary);
                parameters.Add("@$JoiningDate", employee.JoiningDate);
                parameters.Add("@$WorkStatus", employee.WorkStatus);
                parameters.Add("@$Action", "Insert");

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                int numberOfAffectedRows = mySqlConnection.Execute(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý kết quả trả về từ DB
                if (numberOfAffectedRows > 0)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status201Created, employeeID);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }

            }
            catch (MySqlException mySqlException)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                if (mySqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
            catch (Exception)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Sửa 1 nhân viên
        /// </summary>
        /// <param name="employeeID">ID của nhân viên muốn sửa</param>
        /// <param name="employee">Đối tượng nhân viên muốn sửa</param>
        /// <returns>ID của nhân viên vừa sửa</returns>
        /// Created by: LTTRUNG (26/07/2022)
        [HttpPut("{employeeID}")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(Guid))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult UpdateEmployee([FromRoute] Guid employeeID, [FromBody] Employee employee)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên Stored procedure
                string storedProcedureName = "Proc_Employee_InsertUpdateEmployee";

                // Chuẩn bị tham số đầu vào cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$EmployeeID", employeeID);
                parameters.Add("@$ImageUrl", employee.ImageUrl);
                parameters.Add("@$EmployeeCode", employee.EmployeeCode);
                parameters.Add("@$EmployeeName", employee.EmployeeName);
                parameters.Add("@$DateOfBirth", employee.DateOfBirth);
                parameters.Add("@$Gender", employee.Gender);
                parameters.Add("@$IdentityNumber", employee.IdentityNumber);
                parameters.Add("@$IdentityIssuedPlace", employee.IdentityIssuedPlace);
                parameters.Add("@$IdentityIssuedDate", employee.IdentityIssuedDate);
                parameters.Add("@$Email", employee.Email);
                parameters.Add("@$PhoneNumber", employee.PhoneNumber);
                parameters.Add("@$PositionID", employee.PositionID);
                parameters.Add("@$DepartmentID", employee.DepartmentID);
                parameters.Add("@$TaxCode", employee.TaxCode);
                parameters.Add("@$Salary", employee.Salary);
                parameters.Add("@$JoiningDate", employee.JoiningDate);
                parameters.Add("@$WorkStatus", employee.WorkStatus);
                parameters.Add("@$Action", "Update");

                // Thực hiện gọi vào DB để chạy stored procedure với tham số đầu vào ở trên
                int numberOfAffectedRows = mySqlConnection.Execute(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý kết quả trả về từ DB
                if (numberOfAffectedRows > 0)
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, employeeID);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }

            }
            catch (MySqlException mySqlException)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                if (mySqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }

                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
            catch (Exception)
            {
                // TODO: Sau này có thể bổ sung log lỗi ở đây để khi gặp exception trace lỗi cho dễ
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Xóa 1 nhân viên
        /// </summary>
        /// <param name="employeeID">ID của nhân viên muốn xóa</param>
        /// <returns>ID của nhân viên vừa xóa</returns>
        /// Created by: LTTRUNG (26/07/2022)
        [HttpDelete("{employeeID}")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(Guid))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult DeleteEmployeeByID([FromRoute] Guid employeeID)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên stored procedure
                string storedProcedureName = "Proc_Employee_DeleteEmployee";

                // Chuẩn bị tham số đầu vào cho câu lệnh DELETE
                var parameters = new DynamicParameters();
                parameters.Add("@$EmployeeID", employeeID);

                // Thực hiện gọi vào DB để chạy câu lệnh DELETE với tham số đầu vào ở trên
                int numberOfAffectedRows = mySqlConnection.Execute(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);

                // Xử lý kết quả trả về từ DB
                if (numberOfAffectedRows > 0) 
                {
                    // Trả về dữ liệu cho client
                    return StatusCode(StatusCodes.Status200OK, employeeID);
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

        /// <summary>
        /// API kiểm tra trùng trường Email
        /// </summary>
        /// <param name="email">Email của nhân viên muốn kiểm tra</param>
        /// <returns>Kết quả 1 : email đã tồn tại , 0 : email không tồn tại</returns>
        /// Created by: LTTRUNG (26/07/2022)
        [HttpGet("check-duplicate-Email")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(string))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult CheckDuplicateEmail([FromQuery] string? email)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên stored procedure
                string storedProcedureName = "Proc_Employee_CheckDuplicateEmail";

                // Chuẩn bị tham số đầu vào/ra cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$Email", email);
                parameters.Add("@$Result",dbType: DbType.Int32,direction: ParameterDirection.Output);
                // Thực hiện gọi vào DB để chạy stored procedure ở trên
                int request = mySqlConnection.Execute(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);
                int result = parameters.Get<int>("@$Result");
                // Xử lý kết quả trả về từ DB
                return StatusCode(StatusCodes.Status200OK, new CheckDuplicate()
                {
                    CheckEmail = result
                });

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API kiểm tra trùng trường EmployeeCode
        /// </summary>
        /// <param name="code">Mã nhân viên muốn kiểm tra</param>
        /// <returns>Kết quả 1 : code đã tồn tại , 0 : code không tồn tại</returns>
        /// Created by: LTTRUNG (26/07/2022)
        [HttpGet("check-duplicate-Employee-Code")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(string))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult CheckDuplicateEmployeeCode([FromQuery] string? code)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên stored procedure
                string storedProcedureName = "Proc_Employee_CheckDuplicateEmployeeCode";

                // Chuẩn bị tham số đầu vào/ra cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$EmployeeCode", code);
                parameters.Add("@$Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                // Thực hiện gọi vào DB để chạy stored procedure ở trên
                int request = mySqlConnection.Execute(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);
                int result = parameters.Get<int>("@$Result");
                // Xử lý kết quả trả về từ DB
                return StatusCode(StatusCodes.Status200OK, new CheckDuplicate()
                {
                    CheckEmployeeCode = result
                });

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API kiểm tra trùng trường IdentityNumber
        /// </summary>
        /// <param name="identity_number">Mã số CMTND muốn kiểm tra</param>
        /// <returns>Kết quả 1 : code đã tồn tại , 0 : code không tồn tại</returns>
        /// Created by: LTTRUNG (26/07/2022)
        [HttpGet("check-duplicate-Identity-Number")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(string))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult CheckDuplicateIdentityNumber([FromQuery] string? identity_number)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên stored procedure
                string storedProcedureName = "Proc_Employee_CheckDuplicateIdentityNumber";

                // Chuẩn bị tham số đầu vào/ra cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$IdentityNumber", identity_number);
                parameters.Add("@$Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                // Thực hiện gọi vào DB để chạy stored procedure ở trên
                int request = mySqlConnection.Execute(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);
                int result = parameters.Get<int>("@$Result");
                // Xử lý kết quả trả về từ DB
                return StatusCode(StatusCodes.Status200OK, new CheckDuplicate()
                {
                    CheckIdentifyNumber = result
                });

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API kiểm tra trùng trường PhoneNumber
        /// </summary>
        /// <param name="phone_number">Số điện thoại muốn kiểm tra</param>
        /// <returns>Kết quả 1 : code đã tồn tại , 0 : code không tồn tại</returns>
        /// Created by: LTTRUNG (26/07/2022)
        [HttpGet("check-duplicate-Phone-Number")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(string))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult CheckDuplicatePhoneNumber([FromQuery] string? phone_number)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên stored procedure
                string storedProcedureName = "Proc_Employee_CheckDuplicatePhoneNumber";

                // Chuẩn bị tham số đầu vào/ra cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$PhoneNumber", phone_number);
                parameters.Add("@$Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                // Thực hiện gọi vào DB để chạy stored procedure ở trên
                int request = mySqlConnection.Execute(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);
                int result = parameters.Get<int>("@$Result");
                // Xử lý kết quả trả về từ DB
                return StatusCode(StatusCodes.Status200OK, new CheckDuplicate()
                {
                    CheckPhoneNumber = result
                });

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API kiểm tra trùng trường TaxCode
        /// </summary>
        /// <param name="tax_code">Mã số thuế cá nhân muốn kiểm tra</param>
        /// <returns>Kết quả 1 : code đã tồn tại , 0 : code không tồn tại</returns>
        /// Created by: LTTRUNG (26/07/2022)
        [HttpGet("check-duplicate-Tax-Code")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(string))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult CheckDuplicateTaxCode([FromQuery] string? tax_code)
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên stored procedure
                string storedProcedureName = "Proc_Employee_CheckDuplicateTaxCode";

                // Chuẩn bị tham số đầu vào/ra cho stored procedure
                var parameters = new DynamicParameters();
                parameters.Add("@$TaxCode", tax_code);
                parameters.Add("@$Result", dbType: DbType.Int32, direction: ParameterDirection.Output);
                // Thực hiện gọi vào DB để chạy stored procedure ở trên
                int request = mySqlConnection.Execute(storedProcedureName, parameters, commandType: System.Data.CommandType.StoredProcedure);
                int result = parameters.Get<int>("@$Result");
                // Xử lý kết quả trả về từ DB
                return StatusCode(StatusCodes.Status200OK, new CheckDuplicate()
                {
                    CheckTaxCode = result
                });

            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        /// <summary>
        /// API Lấy mã nhân viên mới tự động tăng
        /// </summary>
        /// <returns>Mã nhân viên mới tự động tăng</returns>
        /// Created by: LTTRUNG (26/07/2022)
        [HttpGet("new-code")]
        [SwaggerResponse(StatusCodes.Status200OK, type: typeof(string))]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status500InternalServerError)]
        public IActionResult GetNewEmployeeCode()
        {
            try
            {
                // Khởi tạo kết nối tới DB MySQL
                string connectionString = "Server=localhost;Port=3306;Database=misa.cukcuk.lttrung;Uid=root;Pwd=admin;";
                var mySqlConnection = new MySqlConnection(connectionString);

                // Chuẩn bị tên stored procedure
                string storedProcedureName = "Proc_Employee_GetNewMaxCode";

                // Thực hiện gọi vào DB để chạy stored procedure ở trên
                string newEmployeeCode = mySqlConnection.QueryFirstOrDefault<string>(storedProcedureName, commandType: System.Data.CommandType.StoredProcedure);

                // Trả về dữ liệu cho client
                return StatusCode(StatusCodes.Status200OK, new NewEmployeeCode()
                {
                    EmployeeCode = newEmployeeCode
                }) ;
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
    }
}
