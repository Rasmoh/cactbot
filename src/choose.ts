export const choose = <T>(array: T[], k: number): (() => T[]) => {
    if (k === 1) {
      let index = 0;
      const next = () => {
        if (index >= array.length) {
          index = 0;
          return undefined;
        }
  
        return [array[index++]];
      };
  
      return next;
    } else {
      let index = 0;
      let subset = choose(array.slice(index + 1), k - 1);
      const next = () => {
        let r = subset();
        if (!r) {
          ++index;
          if (index >= array.length - (k - 1)) {
            index = 0;
            return undefined;
          }

          subset = choose(array.slice(index + 1), k - 1);
          r = subset();
        }
        return [array[index], ...r];
      };
  
      return next;
    }
  };
