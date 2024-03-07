export const fullData = {
  products: {
    searchPlaceholder: "商品",
    createHeaderText: "商品資料",
    modalConfig: {
      avatar: false,
      name_label: "商品型號"
    }
  },
  series: {
    searchPlaceholder: "系列",
    createHeaderText: "商品系列",
    modalConfig: {
      avatar: false
    }
  },
  colorType: {
    searchPlaceholder: "色系",
    createHeaderText: "色系類別",
    modalConfig: {
      avatar: false
    }
  },
  styleType: {
    searchPlaceholder: "風格",
    createHeaderText: "風格類別",
    modalConfig: {
      avatar: false
    }
  },
  material: {
    searchPlaceholder: "材質",
    createHeaderText: "面料材質",
    modalConfig: {
      avatar: false
    }
  },
  vendor: {
    searchPlaceholder: "供應商",
    createHeaderText: "供應商",
    modalConfig: {
      avatar: false
    }
  },
  accounts: {
    searchPlaceholder: "員工",
    createHeaderText: "員工資料",
    modalConfig: {
      avatar: true,
      name_label: "姓名",
      email: true,
      role: true
    }
  },
  role: {
    searchPlaceholder: "角色類別",
    createHeaderText: "角色類別",
    modalConfig: {
      avatar: false
    }
  },
  environment: {
    searchPlaceholder: "場景",
    createHeaderText: "場景",
    modalConfig: {
      avatar: false
    }
  },
};

export const placeholderDict = Object.entries(fullData).reduce(
  (dict, [key, value]) => {
    dict[key] = value.searchPlaceholder;
    return dict;
  },
  {}
);

export const createHeaderText = Object.entries(fullData).reduce(
  (dict, [key, value]) => {
    dict[key] = value.createHeaderText;
    return dict;
  },
  {}
);

export const modalConfig = Object.entries(fullData).reduce(
  (dict, [key, value]) => {
    dict[key] = value.modalConfig;
    return dict;
  },
  {}
);