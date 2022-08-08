namespace MISA.CukCuk.Internship.Entities
{
    public class Position : Common
    {
        /// <summary>
        /// ID vị trí chức vụ
        /// </summary>
        public Guid PositionID { get; set; }

        /// <summary>
        /// ID mã vị trí chức vụ
        /// </summary>
        public string? PositionCode { get; set; }

        /// <summary>
        /// ID tên vị trí chức vụ
        /// </summary>
        public string? PositionName { get; set; }
    }
}
