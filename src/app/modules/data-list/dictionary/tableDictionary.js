export const fullData = {
  products: {
    searchPlaceholder: "商品",
    createHeaderText: "商品資料",
    modalConfig: {
      avatar: false,
      name_label: "商品型號",
      name_placeholder: "請輸入商品型號",
      style_label: "商品樣式",
      style_placeholder: "請輸入商品樣式",
      vendor_label: "供應廠商",
      available_label: "上架狀態",
      series_label: "商品系列",
      color_label: "商品顏色",
      material_label: "面料材質",
      design_label: "商品風格",
      absorption_label: "吸音效果",
      block_label: "遮光效果",
      description_label: "商品描述",
    },
    formField: {
      name: "",
      style: "",
      vendor: "",
      avaliable: "",
      series: "",
      color: "",
      material: "",
      design: "",
      absorption: 1,
      block: 1,
      description: "",
    },
  },
  series: {
    searchPlaceholder: "系列",
    createHeaderText: "商品系列",
    modalConfig: {
      avatar: false,
    },
  },
  colorScheme: {
    searchPlaceholder: "色系",
    createHeaderText: "色系類別",
    modalConfig: {
      avatar: false,
    },
  },
  design: {
    searchPlaceholder: "風格",
    createHeaderText: "風格類別",
    modalConfig: {
      avatar: false,
    },
  },
  material: {
    searchPlaceholder: "材質",
    createHeaderText: "面料材質",
    modalConfig: {
      avatar: false,
    },
  },
  vendor: {
    searchPlaceholder: "供應商",
    createHeaderText: "供應商",
    modalConfig: {
      avatar: false,
    },
  },
  accounts: {
    searchPlaceholder: "員工",
    createHeaderText: "員工資料",
    modalConfig: {
      avatar: true,
      name_label: "姓名",
      email: true,
      role: true,
    },
  },
  role: {
    searchPlaceholder: "角色類別",
    createHeaderText: "角色類別",
    modalConfig: {
      avatar: false,
    },
  },
  environment: {
    searchPlaceholder: "場景",
    createHeaderText: "場景",
    modalConfig: {
      avatar: false,
    },
  },
};

const ArrangeWithProperty = Object.entries(fullData).reduce(
  (tableDict, [table, content]) => {
    Object.entries(content).reduce((dict, [key, value]) => {
      dict[key] === undefined && (dict[key] = {});
      dict[key][table] = value;
      return dict;
    }, tableDict);
    return tableDict;
  },
  {}
);

export default ArrangeWithProperty;
