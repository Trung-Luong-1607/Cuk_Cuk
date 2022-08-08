namespace MISA.CukCuk.Internship.Entities
{
    public class Department : Common
    {
        /// <summary>
        /// ID phòng ban
        /// </summary>
        public Guid DepartmentID { get; set; }

        /// <summary>
        /// Mã phòng ban
        /// </summary>
        public string? DepartmentCode { get; set; }

        /// <summary>
        /// Tên phòng ban
        /// </summary>
        public string? DepartmentName { get; set; }
    }
}
