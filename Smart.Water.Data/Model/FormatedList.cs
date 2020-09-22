using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Smart.Water.Data.Model
{
    public class FormatedList<T>
    {
        public FormatedList()
        {
        }

        public int sEcho { get; set; }
        public int iTotalRecords { get; set; }
        public int iTotalDisplayRecords { get; set; }
        public T aaData { get; set; }
    }
}
