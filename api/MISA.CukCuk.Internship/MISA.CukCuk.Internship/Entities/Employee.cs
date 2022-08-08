using MISA.CukCuk.Internship.Enums;
using System.ComponentModel.DataAnnotations;

namespace MISA.CukCuk.Internship.Entities
{
    public class Employee : Common
    {
        /// <summary>
        /// ID nhân viên
        /// </summary>
        public Guid EmployeeID { get; set; }

        /// <summary>
        /// Đường dẫn ảnh đại diện
        /// </summary>
        public string? ImageUrl { get; set; }

        /// <summary>
        /// Mã nhân viên
        /// </summary>
        [Required(ErrorMessage = "e004")]
        public string EmployeeCode { get; set; }

        /// <summary>
        /// Tên nhân viên
        /// </summary>
        [Required(ErrorMessage = "e005")]
        public string? EmployeeName { get; set; }

        /// <summary>
        /// Ngày sinh
        /// </summary>
        public DateTime? DateOfBirth { get; set; }

        /// <summary>
        /// Giới tính
        /// </summary>
        public Gender? Gender { get; set; }

        /// <summary>
        /// Số CMND
        /// </summary>
        [Required(ErrorMessage = "e006")]
        public string IdentityNumber { get; set; }

        /// <summary>
        /// Nơi cấp CMND
        /// </summary>
        public string? IdentityIssuedPlace { get; set; }

        /// <summary>
        /// Ngày cấp CMND
        /// </summary>
        public DateTime? IdentityIssuedDate { get; set; }

        /// <summary>
        /// Email
        /// </summary>
        [Required(ErrorMessage = "e007")]
        [EmailAddress(ErrorMessage = "e009")]
        public string Email { get; set; }

        /// <summary>
        /// Số điện thoại
        /// </summary>
        [Required(ErrorMessage = "e008")]
        public string PhoneNumber { get; set; }

        /// <summary>
        /// ID vị trí chức vụ
        /// </summary>
        public Guid? PositionID { get; set; }

        /// Tên vị trí
        /// </summary>
        public string? PositionName { get; set; }

        /// <summary>
        /// ID phòng ban
        /// </summary>
        public Guid? DepartmentID { get; set; }
        /// <summary>
        /// Tên phòng ban
        /// </summary>
        public string? DepartmentName { get; set; }

        /// <summary>
        /// Mã số thuế cá nhân
        /// </summary>
        public string? TaxCode { get; set; }

        /// <summary>
        /// Lương
        /// </summary>
        public double? Salary { get; set; }

        /// <summary>
        /// Ngày gia nhập
        /// </summary>
        public DateTime? JoiningDate { get; set; }

        /// <summary>
        /// Tình trạng công việc
        /// </summary>
        public WorkStatus? WorkStatus { get; set; }
    }
}
