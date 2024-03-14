import matplotlib.pyplot as plt
import numpy as np


class Ocean:
    width = 200
    height = 100

    def __init__(self):
        self.width = Ocean.width
        self.height = Ocean.height
        self.ocean_map = np.zeros((self.height, self.width), dtype=int)

    def generate_land(self, num_landmasses=10, min_land_size=50):
        for _ in range(num_landmasses):
            max_possible_size = min(self.width // 10, self.height // 10)
            if min_land_size >= max_possible_size:
                land_size = max_possible_size
            else:
                land_size = np.random.randint(min_land_size, max_possible_size)
            start_x = np.random.randint(0, self.width - land_size)
            start_y = np.random.randint(0, self.height - land_size)
            self.ocean_map[start_y:start_y + land_size, start_x:start_x + land_size] = 1

    def display_ocean(self):
        cmap = plt.cm.viridis
        cmap.set_under('cyan')  # Color for ocean
        cmap.set_over('yellow')  # Color for land

        plt.figure(figsize=(10, 10))
        plt.imshow(self.ocean_map, cmap=cmap, vmin=0.5, vmax=3.5)
        plt.colorbar(label='Features')
        plt.title('Ocean Map')
        plt.xlabel('X')
        plt.ylabel('Y')

        plt.show()

    def convert_to_string(self):
        ocean_string = ''
        for row in self.ocean_map:
            for value in row:
                if value == 0:
                    ocean_string += 'A'  # Water represented by 'A'
                else:
                    ocean_string += 'L'  # Land represented by 'L'
            ocean_string += '\n'  # Add newline after each row
        return ocean_string


#Example usage:
#