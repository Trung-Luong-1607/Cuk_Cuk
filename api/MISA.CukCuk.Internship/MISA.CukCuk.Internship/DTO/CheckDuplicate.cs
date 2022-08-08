namespace MISA.CukCuk.Internship.DTO
{
    /// <summary>
    /// Dữ liệu trả về giá trị check duplicate : 0 - không trùng , 1 - trùng
    /// Create by: LTTRUNG (08/08/2022)
    /// </summary>
    public class CheckDuplicate
    {
        public int CheckEmployeeCode { get; set; }

        public int CheckIdentifyNumber { get; set; }

        public int CheckPhoneNumber { get; set; }

        public int CheckEmail { get; set; }

        public int CheckTaxCode { get; set; }
    }
}
