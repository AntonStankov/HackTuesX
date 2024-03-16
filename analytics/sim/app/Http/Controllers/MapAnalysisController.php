<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MapAnalysisController extends Controller
{
    public function analyzeMap(Request $request)
    {
        $inputMap = $request->input('inputMap');

        // variant with new lines in post
        // $mapRows = explode("\n", trim($inputMap));
        // $grid = array_map(function($row) {
        //     return str_split(trim($row));
        // }, $mapRows);

        // variant 2 - no new lines in post
        $mapRows = str_split($inputMap, 200);
        $grid = array_map(function ($row) {
            return str_split($row, 1); // Split each row into individual characters
        }, $mapRows);

        $fishLife = 0;
        $sharkLife = 0;
        $oceanCleanliness = 100;
        $shipProductivity = 0;
        $rigProductivity = 0;
        $efficiency=0;
        $ecology=0;
        $budget = 50;
        $index=0;
         
        $counts = [
            'shark' => 0,
            'fishF' => 0,
            'fishX' => 0,
            'fishC' => 0,
            'bigShipT' => 0,
            'bigShipB' => 0,
            'bigShipD' => 0,
            'bigShipI' => 0,
            'smallShipE' => 0,
            'smallShipH' => 0,
            'smallShipJ' => 0,
            'smallShipG' => 0
        ];
        
        $prices = [
            'T' => 7,
            'B' => 3,
            'D' => 10,
            'E' => 6,
            'G' => 3,
            'H' => 1,
            'I' => 5,
            'J' => 2,
        ];
        $fishCharacters = ['X', 'C', 'F'];

        $isCorrupted = false;

        foreach ($grid as $rowIndex => $row) {
            for ($i = 0; $i < count($row); $i++) {
                $char = $row[$i];
                $nextChar = $row[$i + 1] ?? null;
                $nextNextChar = $row[$i + 2] ?? null;

                if ($char == 'K') {
                    if ($nextChar == 'K') {
                        $counts['shark']++;
                        $i++; 
                    } else {
                        $isCorrupted = true;
                        break 2; 
                    }
                }
                if($char == 'F'){
                    $counts['fishF']++;
                }
                if($char == 'C'){
                    $counts['fishC']++;
                }
                if($char == 'X'){
                    $counts['fishX']++;
                }

                foreach (['T', 'B', 'D', 'I'] as $shipChar) {
                    if ($char == $shipChar) {
                        if ($nextChar == $shipChar && $nextNextChar == $shipChar && $row[$i + 3] == $shipChar) {
                            $counts['bigShip' . $shipChar]++;
                            $i += 3; 
                            if ($char == 'T' || $char =='B'){
                                $oceanCleanliness -= 10;
                            }else {
                                $oceanCleanliness -= 5;
                            }

                            if($char == 'T'|| $char == 'D'){
                                $shipProductivity += 10;
                            }else{
                                $shipProductivity += 5;
                            }

                        switch($char) {
                                case 'T':
                                    $budget += 7;
                                    break;
                                case 'B':
                                    $budget += 3;
                                    break;
                                case 'D':
                                    $budget += 10;
                                    break;
                                case 'E':
                                    $budget += 6;
                                    break;
                                case 'G':
                                    $budget += 3;
                                    break;
                                case 'H':
                                    $budget += 1;
                                    break;
                                case 'I':
                                    $budget += 5;
                                    break;
                                case 'J':
                                    $budget += 2;
                                    break;
                                }
                            if ($this->checkForFishAroundShip($grid, $rowIndex, $i - 2, 10, $fishCharacters)) {
                            $fishLife -= 5;
                            $sharkLife += 20;
                            }
                        } else {
                            $isCorrupted = true;
                            break 3; 
                        }
                    }
                }

                foreach (['E', 'H', 'J','G'] as $shipChar) {
                    if ($char == $shipChar) {
                        if ($nextChar == $shipChar && $nextNextChar == $shipChar) {
                            $counts['smallShip' . $shipChar]++;
                            $i += 2; 
                            if ($char == 'G' || $char =='J'){
                                $oceanCleanliness -= 10;
                            }else {
                                $oceanCleanliness -= 5;
                            }

                            if($char == 'E'|| $char == 'G'){
                                $shipProductivity += 10;
                            }else{
                                $shipProductivity += 5;
                            }
                            
                            if ($this->checkForFishAroundShip($grid, $rowIndex, $i - 1, 8, $fishCharacters)) {
                                $fishLife -= 3;
                                $sharkLife += 12;
                            }
                        } else {
                            $isCorrupted = true;
                            break 3; 
                        }
                    }
                }
            }
        }
        foreach ($grid as $rowIndex => $row) {
            for ($colIndex = 0; $colIndex < count($row); $colIndex++) {
                if ($row[$colIndex] == 'K') {
                    if (isset($row[$colIndex + 1]) && $row[$colIndex + 1] == 'K') {
                        $fnears = $this->checkFishNearSharks($grid, $rowIndex, $colIndex, $fishCharacters);
                        if($fnears == 1){
                            $sharkLife -= 5;
                        }elseif($fnears == 0){
                            $sharkLife +=10;
                        }else{
                            $fishLife -= 5;
                        }
                        $colIndex++; 
                    }
                }
            }
        }



        $oilRigsCounts = [
            'M' => 0,
            'N' => 0,
            'O' => 0,
            'P' => 0
        ];

        foreach ($grid as $rowIndex => $row) {
            if ($rowIndex % 2 == 1) continue; 

            for ($colIndex = 0; $colIndex < count($row) - 1; $colIndex++) {
                $char = $row[$colIndex];
                if (isset($oilRigsCounts[$char])) {
        
                    if (
                        isset($grid[$rowIndex + 1][$colIndex], $grid[$rowIndex][$colIndex + 1], $grid[$rowIndex + 1][$colIndex + 1]) &&
                        $grid[$rowIndex + 1][$colIndex] == $char &&
                        $grid[$rowIndex][$colIndex + 1] == $char &&
                        $grid[$rowIndex + 1][$colIndex + 1] == $char
                    ) {
                        $oilRigsCounts[$char]++;
                        if($char == 'M'|| $char == 'N'){
                            $rigProductivity += 10;
                        }else{
                            $rigProductivity += 5;
                        }
                        
                        $fnearr = $this->checkFishAroundRigs($grid, $rowIndex, $colIndex, $char, $fishCharacters);
                        if($fnearr == 0){
                            $fishLife += 15;
                            $oceanCleanliness -=5;
                          
                        }elseif($fnearr == 1){
                            $oceanCleanliness -= 10;
                         
                            $fishLife -= 10;
                        }
                        $colIndex++; 
                    } else {
                        return response()->json(['error' => 'The map is corrupted.'], 422);
                        return;
                    }
                }
            }
        }

       
        if ($isCorrupted) {
            return response()->json(['error' => 'The map is corrupted.'], 422);
        } else {


        $hitratio = $this->sharkfishratio($counts);
        if($hitratio == -1){
            $fishLive -= 5;
        }elseif($hitratio == 0){
            $sharkLife += 15;
            $fishLife += 15;
        }else{
            $sharkLife -=5;
        }

        $fishratio = $this->fishRatio($counts);
        if($fishratio==1){
            $fishLife += 20;
        }else{
            $fishLife -= 10;
        }


        if($fishLife < 0)$fishLife = 0;
        if($fishLife > 100)$fishLife = 100;
        if($sharkLife < 0)$sharkLife = 0;
        if($sharkLife > 100)$sharkLife = 100;

        $ecology = ($fishLife + $sharkLife + $oceanCleanliness)/3;
        $budget = $budget / 3;
        $efficiency = ($shipProductivity + $rigProductivity)/2;
        $index = ($efficiency - $budget/3) + $ecology;

        }
        
        $responseData = [
            'index' => $index, // Ensure $index is calculated within your logic
            'ecology' => $ecology, // Ensure $ecology is calculated within your logic
            'budget' => $budget, // Adjustments to $budget should be done in your logic
            'efficiency' => $efficiency, // Ensure $efficiency is calculated within your logic
            'sharkLife' => $sharkLife, // Adjusted within your logic
            'fishLife' => $fishLife, // Adjusted within your logic
            'oceanCleaness' => $oceanCleanliness, // Adjusted within your logic
            'shipProductivity' => $shipProductivity, // Adjusted within your logic
            'rigProductivity' => $rigProductivity, // Adjusted within your logic
        ];

        return response()->json($responseData);
    }
    
    private function checkForFishAroundShip($grid, $rowIndex, $colIndex, $radius, $fishCharacters)
    {
        for ($row = max(0, $rowIndex - $radius); $row <= min(count($grid) - 1, $rowIndex + $radius); $row++) {
            for ($col = max(0, $colIndex - $radius); $col <= min(count($grid[0]) - 1, $colIndex + $radius); $col++) {
                if (in_array($grid[$row][$col], $fishCharacters)) {
                    return true;
                }
            }
        }
        return false;
    }
    private function sharkfishratio($counts)
    {
        $akuli = $counts['shark'] * 3;
        $ribi = ($counts['fishF'] + $counts['fishX'] + $counts['fishC']) * 3000;
        $ratio = $ribi / $akuli;
        if ($ratio >= 4501) {
            return -1; // Too far
        } elseif ($ratio <= 2999) {
            return 1; // Too close
        } else {
            return 0; // Golden ratio
        }
    }
    private function checkFishNearSharks($grid, $sharkRow, $sharkCol, $fishCharacters)
    {
        $closeFish = 0;
        $farFish = 0;

        for ($row = max(0, $sharkRow - 21); $row <= min(count($grid) - 1, $sharkRow + 21); $row++) {
            for ($col = max(0, $sharkCol - 21); $col <= min(count($grid[0]) - 1, $sharkCol + 21); $col++) {
                if (in_array($grid[$row][$col], $fishCharacters)) {
                    $distance = sqrt(pow($row - $sharkRow, 2) + pow($col - $sharkCol, 2));
                    if ($distance <= 9) {
                        $closeFish++;
                    } elseif ($distance <= 21) {
                        $farFish++;
                    }
                }
            }
        }

        if ($closeFish > 0) {
            return -1; // Too close
        } elseif ($farFish > 0) {
            return 0; // Perfect
        } else {
            return 1; // Too far
        }
    }

    private function checkFishAroundRigs($grid, $rigRow, $rigCol, $rigType, $fishCharacters)
    {
        $fishCount = 0;

        for ($row = max(0, $rigRow - 14); $row <= min(count($grid) - 1, $rigRow + 15); $row++) {
            for ($col = max(0, $rigCol - 14); $col <= min(count($grid[0]) - 1, $rigCol + 15); $col++) {
                if (in_array($grid[$row][$col], $fishCharacters)) {
                    $fishCount++;
                }
            }
        }

        if ($fishCount > 0) {
            if (in_array($rigType, ['N', 'P'])) {
                return 0; // Near low-emission rig, may be beneficial
            } else {
                return 1; // Near hazardous rig, dangerous
            }
        }
    }
    private function fishRatio($counts)
    {
        $fishX = $counts['fishX'];
        $fishC = $counts['fishC'];
        $fishF = $counts['fishF'];

        $totalFish = $fishX + $fishC + $fishF;

        if ($totalFish == 0) {
            return "No fish found.";
        }

        $ratioX = $fishX / $totalFish;
        $ratioC = $fishC / $totalFish;
        $ratioF = $fishF / $totalFish;

        $idealRatio = 1 / 3;
        $tolerance = 0.2; // 20%

        if (abs($ratioX - $idealRatio) <= $tolerance && abs($ratioC - $idealRatio) <= $tolerance && abs($ratioF - $idealRatio) <= $tolerance) {
            return 1; // Close to 1:1:1 ratio
        } else {
            return 0; // Far from ideal ratio
        }
    }
}
